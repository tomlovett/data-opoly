'''
Game(game_id=0, players=4, turns=80):
tile_taps, tile_lands
player_locs[turn]: [locs]
first_tap[tile]: turn, tapped[turn]: tapped
predecessors, successors
num_laps
Players:
tap_history

{tile: int} first_tap, tile_lands, tile_taps
{tile: {tile: int}}  predecessors, successors
{turn: array} player_locs, tapped, player.tap_history
ints: laps_per_turn
'''

# run multiple simulations, merge data into master
from game_simulation import Game
import time, numpy

class Simulation(object):
  def __init__(self, num_games=1000, num_players=4, num_turns=60, auto_run=False):
    self.num_games = num_games
    self.num_players, self.num_turns = num_players, num_turns
    self.games = []
    self.genDicts()
    if auto_run == True:
      self.runSimulation()
  
  def runSimulation(self):
    clock = time.time()
    for i in range(self.num_games):
      current_game = Game(i, self.num_players, self.num_turns)
      self.games.append(current_game)
      self.collectData(current_game)
    clock = str(round(time.time() - clock, 5))
    print 'simulation complete. time: ' + clock + ' seconds'

  def collectData(self, game):
    self.turns_per_lap.extend(game.turns_per_lap)
    self.all_tapped.append(game.all_tapped)
    self.all_props_tapped.append(game.all_props_tapped)
    for p in game.players:
        self.player_histories.append(p.tap_history)
    for turn in range(1, self.num_turns):
      self.player_locs[turn].append(game.player_locs[turn][:])
      self.tapped[turn].append(game.tapped[turn][:])
    for tile in iter(tileDict()):
      try:  # tile_taps[tile] only generated on first land
        self.tile_taps[tile].append(game.tile_taps[tile])
      except: # exception to handle ungenerated key
        self.tile_taps[tile].append(0)
      self.first_tap[tile].append(game.first_tap[tile])
      self.tile_lands[tile].append(game.tile_lands[tile])
      for t2 in iter(tileDict()):
        self.predecessors[tile][t2] += game.predecessors[tile][t2]
        self.successors[tile][t2] += game.successors[tile][t2]

  def genDicts(self):
    self.turns_per_lap = []
    self.player_histories = []
    # {turn: array}     game.player_locs is {turn: []}
    self.tapped, self.player_locs = {}, {}
    self.all_tapped, self.all_props_tapped = [], []
    for i in range(self.num_turns):
      self.tapped[i] = []
      self.player_locs[i] = []
    # {tile: array}
    self.first_tap = tileDict()
    self.tile_taps = tileDict()
    self.tile_lands = tileDict()
    # {tile: {tile: array}}
    self.predecessors = tileDict()
    self.successors = tileDict()
    for tile in iter(tileDict()):
      self.predecessors[tile] = tileDict()
      self.successors[tile] = tileDict()
      for tile2 in iter(tileDict()):
        self.predecessors[tile][tile2] = 0
        self.successors[tile][tile2] = 0

# Isolated dictionary-generating function to counteract array values being linked to eachother
def tileDict():
  temp = dict()
  for i in range(40):
    temp[i] = list()
  temp[10.5] = list()
  return temp


