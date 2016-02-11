import random, chanceCC_card, json

# Player class could function as a simple dict but I prefer p.loc to p['loc'] 
class Player(object):
  def __init__(self, turn_limit):
    self.loc = 0
    self.jail_rolls = -1
    self.prev_land = 0
    self.num_doubles = 0
    self.roll = 0
    self.dubs = False
    self.tap_history = {}
    self.lap_counter = 0
    for i in range(1, turn_limit):
      self.tap_history[i] = []

class Deck(object):
  def __init__(self, name):
    self.stack = []
    if name == 'CC':
      self.base = ['jail',0,99,99,99,99,99,99,99,99,99,99,99,99,99,99]
    elif name == 'chance':
      self.base = ['jail','RR','Util',-3,0,45,11,24,39,99,99,99,99,99,99]
    
  def restock(self):
    self.stack = self.base[:]
    random.shuffle(self.stack)

  def card(self):
    try:
      return self.stack.pop()
    except:
      self.restock()
      return self.stack.pop()
#
class Game(object):
  def __init__(self, game_id=0, players=4, turns=60, auto_run=True):
    self.game_id = game_id
    self.turn_limit, self.turn_id = turns, 1
    self.turns_per_lap = []
    # generate data-recording dictionaries
    self.all_tapped, self.all_props_tapped = 0, 0
    self.all_props = [1,3,5,6,8,9,11,12,13,14,15,16,18,19,21,23,24,25,
       26,27,28,29,31,32,34,35,37,39]
    self.tapped, self.tile_taps = {}, {}
    self.tileDict = {10.5: 0}    # tileDict contains a key for every tile on the board
    for i in range(40):
      self.tileDict[i] = 0
    self.first_tap = self.tileDict.copy()
    self.tile_lands = self.tileDict.copy()
    self.predecessors, self.successors = self.tileDict.copy(), self.tileDict.copy()
    for key in iter(self.tileDict):
      self.predecessors[key] = self.tileDict.copy()
      self.successors[key] = self.tileDict.copy()

    self.players, self.player_locs = [], {}
    for i in range(players):
      self.players.append(Player(self.turn_limit))
    for i in range(1, self.turn_limit):
      self.player_locs[i] = []
    self.chance, self.CC = Deck('chance'), Deck('CC')
    
    if auto_run == True:
      self.run_simulation()

  def run_simulation(self):
    for i in range(self.turn_limit-1):
      self.turn()
    return self

##
  def turn(self):
    try:    #copy previous turn tapped to current
      self.tapped[self.turn_id] = self.tapped[self.turn_id-1][:]
    except: 
      self.tapped[1] = []
    for p in self.players:
      self.player_turn(p)
      self.tile_lands[p.loc] += 1
      self.player_locs[self.turn_id].append(p.loc)
      self.pred_success(p)
    self.turn_id += 1
    return
    
##
  def player_turn(self, p):
    self.roll(p)
    p.lap_counter += 1
    if p.loc == 10.5:
      self.jail_turn(p)
      return
    p.loc += p.roll
    self.pass_GO(p)  # check passGO: reset position, record lap
    p.tap_history[self.turn_id].append(p.loc)
    self.jail(p)
    # empty dict used for tile_taps so an exception is raised when a tile has been tapped the first time, thus making it easier to signal this event
    try: 
      self.tile_taps[p.loc] += 1
    except: # records first tap in two dimensions
      self.tile_taps[p.loc] = 1
      self.first_tap[p.loc] = self.turn_id
      self.tapped[self.turn_id].append(p.loc)
      self.tapped[self.turn_id].sort()
      if p.loc in self.all_props:
        self.all_props.remove(p.loc)
        if len(self.all_props) == 0:
          self.all_props_tapped = self.turn_id          
      if len(self.tapped[self.turn_id]) == 41:
        self.all_tapped = self.turn_id
    self.chanceCC(p)
    if p.dubs == True and p.jail_rolls != 0:
      p.lap_counter -= 1
      self.player_turn(p)

##
  def roll(self, p):
    a, b = random.randint(1,6), random.randint(1,6)
    p.roll = a+b
    if a == b:
      p.dubs = True
      return True
    else:
      p.dubs = False
      return False

##
  def pass_GO(self, p):
    if p.loc > 39 or p.loc == 0:
      p.loc %= 40
      self.turns_per_lap.append(p.lap_counter)
      p.lap_counter = 0

##
  def jail_turn(self, p):
    if self.turn_id < 20 or p.dubs == True or p.jail_rolls == 2:
      p.loc = int(p.roll + 10)
      p.jail_rolls = -1
      self.pred_success(p)
    else:
      p.jail_rolls += 1
    p.tap_history[self.turn_id].append(p.loc)

##
  def jail(self, p):
    if (p.loc != 30) and not (p.num_doubles == 2 and p.dubs == True):
      return
    if p.loc == 30:
      try:
        self.tile_taps[p.loc] += 1
      except: # records first tap in two dimensions
        self.tile_taps[p.loc] = 1
        self.first_tap[p.loc] = self.turn_id
        self.tapped[self.turn_id].append(p.loc)
    p.loc = 10.5
    p.jail_rolls, p.num_doubles = 0, 0
    p.tap_history[self.turn_id].append(10.5)

##
  def chanceCC(self, p):
    if p.loc not in [7,22,36,2,17,33]:
      return
    # would rather not pass game object back and forth this way, but control flow is very cluttered
    # modifying game from chanceCC module would be unnecessarily complicated
    self, p = chanceCC_card.eval(self, p)

##
  def pred_success(self, p):
    self.predecessors[p.loc][p.prev_land] += 1
    self.successors[p.prev_land][p.loc] += 1
    p.prev_land = p.loc

a = Game()
