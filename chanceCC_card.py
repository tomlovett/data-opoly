import random

"""
An abstraction to take away the cluttered control flow of sorting out card results

A different method of evaluation might be simpler, but I can't remember my idea at the moment.
"""
def eval(game, p):
  if p.loc in [7,22,36]:
    card = game.chance.card()
  elif p.loc in [2, 17, 33]:
    card = game.CC.card()
# at last-most Chance and not going to Boardwalk implies passing GO
  if card == 99:
    return game, p
  if p.loc == 36 and card != 39:
    game.turns_per_lap.append(p.lap_counter)
    p.lap_counter = 0
# card that change location
  if type(card) == int and card != -3:
    p.loc = card
    game.pass_GO(p)
# Go back three spaces
  elif card == -3:
    p.loc -= 3 
    game.chanceCC(p)
# Go to nearest Utility
  elif card == 'Util':
    if p.loc == 22:
	  p.loc = 28
    else:
	  p.loc = 12
# Go to nearest Railroad
  elif card == 'RR':
    if p.loc == 7:
	  p.loc = 10
    elif p.loc == 22:
  	  p.loc = 25
    else:
      game.turns_per_lap.append(p.lap_counter)
      p.lap_counter = 0
      p.loc = 5
# Go to Jail
  elif card == 'jail':
    game.jail(p)
  return game, p

def restock_deck(game, deck):
  if len(game.chance) == 0:
    game.chance = game.chance_base[:]
    random.shuffle(game.chance)
    return game.chance
  else:
    game.CC = game.CC_base[:]
    random.shuffle(game.CC)
    return game.CC