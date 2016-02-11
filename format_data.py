'''
./tap_frequency/ # 1 file
   data.txt { [each_tile]: { taps_per_game: #, std_dev: #, perc_of_whole: # } }

./first_taps/ # 1 file
   data.txt { [each_tile]: {avg_turn: # , std_dev: #} }

./tapped/ # 50 files
  [turn].txt { [each_tile] : prob of tap }

./loc_by_turn/ # 50
   [turn].txt { tile[each] : {proportion: #, mouseover: {perc_number: #} }
# similar to tapped: iterate turns; collect lands per each tile; divide by (games X players); store

./predecessors/ # 41 files
   [tile].txt { [tile_percentage]: # }

./successors/  # 41 files
   [tile].txt { [tile_percentage]: # }

./sticky/ # 1 file
  sticky.txt (avg, std_dev, median) X (turns_per_lap, all_tapped, all_props_tapped)
'''
from master_sim import Simulation, tileDict
from game_simulation import Game
import numpy, os, json, time
os.chdir('data')

# to-do: normalize results for each display || JS function on display, yeah

s = Simulation(auto_run=False)
g = Game(auto_run=False)
tileDictArray, tileDictInt = tileDict(), g.tileDict.copy()

def data_suite(games=1000, turns=60):
  sim = Simulation(num_games=games, num_turns=turns, auto_run=True)
  clock = time.time()
  tapFrequency(sim)
  locByTurn(sim)
  playerHistories(sim)
  sticky(sim)
  firstTaps(sim)
  predSuccess(sim, 'predecessors')
  predSuccess(sim, 'successors')
  tapped(sim)
  clock = str(round(time.time() - clock, 4))
  print 'data_suite complete. time: ' + clock + ' seconds'
  
# sim.tile_taps[tile] = [taps, taps...] one data point for each game
def tapFrequency(sim):
  os.chdir('game_taps')
  data_dict = tileDict()
  total_taps = 0.0 
  for tile in data_dict:
    data_dict[tile] = dict()
    tap_array = sim.tile_taps[tile][:]
    avgStdMed(data_dict[tile], tap_array)
    data_dict[tile]['sum'] = sum(tap_array)
    total_taps += sum(tap_array)
  for tile in data_dict: # iterate again to calculate perc_of_whole
    sum_taps = data_dict[tile].pop('sum')
    data_dict[tile]['perc_of_whole'] = round(sum_taps/total_taps, 5)
  data_dict['total_taps'] = int(total_taps)
  f = open('data.txt', 'w')
  json.dump(data_dict, f)
  f.close()
  os.chdir('..')

def avgStdMed(storage, sim_data):
  storage['avg'] = round(numpy.average(sim_data), 5)
  storage['std_dev'] = round(numpy.std(sim_data), 5)
  storage['median'] = numpy.median(sim_data)

# sim.player_locs[turn][game_index] = [tile, tile, tile, tile]
def locByTurn(sim):
  os.chdir('loc_by_turn')
  num_data_points = float(sim.num_games * sim.num_turns * sim.num_players)
  for turn in range(1, 51):
    data_dict = tileDictInt.copy()
    for game_index in range(sim.num_games):
      for tile in sim.player_locs[turn][game_index]:
        data_dict[tile] += 1
    for tile in data_dict:
      data_dict[tile] = round(data_dict[tile]/num_data_points, 4)
    f = open(str(turn) + '.txt', 'w')
    json.dump(data_dict, f)
    f.close()
  os.chdir('..')

# sim.first_tap[tile] = [turn, turn, turn...]
def firstTaps(sim):
  os.chdir('first_taps')
  first_taps = tileDict()
  for tile in sim.first_tap.keys():
    first_taps[tile] = {}
    first_taps[tile]['avg'] = round(numpy.average(sim.first_tap[tile]), 5)
    first_taps[tile]['std_dev'] = round(numpy.std(sim.first_tap[tile]), 5)
    first_taps[tile]['median'] = numpy.median(sim.first_tap[tile])
  f = open('data.txt', 'w')
  json.dump(first_taps, f)
  f.close()
  os.chdir('..')
  
# Iterate through and store, ID[0] will load as default in browser
def playerHistories(sim):
  os.chdir('player_histories')
  histories = dict()
  id = 0
  for game in sim.games:
    for p in game.players:
      histories[id] = p.tap_history.copy()
      if id % 50 == 0: # breaks storage into 50-player chunks
        f = open(str(id) + '.txt', 'w')
        json.dump(histories, f)
        histories = dict()
      id += 1
  f = open(str(id) + '.txt', 'w')
  json.dump(histories, f)
  os.chdir('..')

#
def sticky(sim):
  os.chdir('sticky')
  data = {'turns_per_lap': {}, 'all_tapped': {}, 'all_props_tapped': {}}
  avgStdMed(data['turns_per_lap'], sim.turns_per_lap)
  avgStdMed(data['all_tapped'], sim.all_tapped)
  avgStdMed(data['all_props_tapped'], sim.all_props_tapped)
  f = open('sticky.txt', 'w')
  json.dump(data, f)
  f.close()
  os.chdir('..')

# Consolidated to one function since data structures are identical
def predSuccess(sim, name):
  os.chdir(name)
  if name == 'predecessors':  # ugly. very ugly.
    source_data = sim.predecessors
  else:
    source_data = sim.successors
  for tile in tileDictInt.keys():
    temp, total = tileDictInt.copy(), 0.0
    for tile2 in temp:
      if tile2 == 10.5: # jail is own primary pred and successor, distorts data
        continue
      total += source_data[tile][tile2]
    for tile2 in temp:
      if total == 0 or tile2 == 10.5:
        temp[tile2] = 0
        continue
      temp[tile2] = round(source_data[tile][tile2] / total, 5)
    f = open(str(tile)+'.txt', 'w')
    json.dump(temp, f)
    f.close()
  os.chdir('..')

#
def tapped(sim):
# sim.tapped[turn][game_index] = [tile, tile...]
# iterate through twice to counteract excessively small values
  # if only iterated through once the increment would be .00427/num_games
  os.chdir('tapped')
  for turn in range(1, 51):
    temp = tileDictInt.copy()
    for game_index in range(sim.num_games):
      for tile in iter(sim.tapped[turn][game_index]):
        temp[tile] += 1.0
    for tile in temp:
      temp[tile] = temp[tile]/sim.num_games
    f = open(str(turn)+'.txt', 'w')
    json.dump(temp, f)
    f.close()
  os.chdir('..')

# Sacrificed readability for compactness; not very readable at first, but very compact
# Could change two different tileDict's into tileDictInt and tileDictArray and store both in game_simulation.py, but current functionality not compromised by the redundant names, changing code would likely cause more problems and work-hours
# could also code tileDict([data_type]); similar issues as above, plus list() may present same linkage issues that were addressed at bottom of master_sim module
