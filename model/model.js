
/***
Wasp Behind the Vase

Board: A graph, each player has a base and there is a common center base from where players must get vases.

[image]

Target: Gather vases from the center base and gather wasps into them by farming. A vase is obtained by movin a piece into the center base and then back to the player's own base. One vase can fit 10 wasps. Wasps are made by farming (more on this later, see Farming).

Points: These are used for moving, building farms and updrades. By default the player receives 1 point every turn and this is increased by having more point farms. [For the actual equation giving point income as a function of number of point farms owned see Player.prototype.getPointIncomeForFarms.]

Wasps: These are the target of the game, the player with most wasps in the end wins. But they can also be used for upgrading and setting bombs on the board.

Pieces: Each player has 6 pieces that the player uses to perform actions. Each piece can be moved once during one turn and any amount of other actions can be performed by all pieces. These other actions include: building farms, setting bombs, upgrading themselves. NOTE: the other actions are done before moving (so farms will be built to the current cell of the piece before moving and upgrading can be done only if the current cell before moving is own base). At the end of the player's move each piece attacks agains opponent pieces in its cell and explodes all opponent bombs (and is effected by them) in its cell.

Moving: Player can move each piece once per turn. Moving 1 step costs nothing, but the cost for moving more is calculated by the the function: 3*(steps-1)^2-2 points. The costs are added for each piece.

Farming: Player can make farms: point farms (cost 2p +3p for each additional) and wasp farms (cost 5p +7p for each additional). A farm is made by a piece and it will be built into the cell in which the piece is currently (before moving). It can't be made in base cells. Farms generate points/wasps each turn of the player. The amounts generated are given by formulas (see Player.prototype) Farms can be destroyed by opponents by landing on the cell where the farm is. The maximum numbers of farms player can have are specified in game constants.

Attacking: At the end of a player's turn each of the players pieces will attack against the opponent-pieces that are in the same cell as it. An amount of energy equal to the player's piece's attack is deducted from the opponent-pieces energy. If energy becomes 0, the piece dies and can't be used anymore (in effect removed from the board, but it will stay in the player's piece list anyhow, just its dead-attribute set to true). If a piece carrying a vase is killed, the vase is lost. If all the player's pieces are dead, that player no longer has a turn. If all players die (this can happen if the last player alive has all pieces die due to opponent bombs (that will be still left on the board after their originator has perished)) the game ends and the winner decided by the amount wasps (see winning the game).

Dead players turn: 

Bombs: Player can also set bombs during turn. A bomb is built by a piece to its current cell (before moving). If opponent-piece is ever to land in the cell where the bomb is(that is: be in the cell at the end of the opponents turn), its energy is reduced by the power of the bomb (and the bomb also removed). Also, every piece not belonging to the player who set the bomb will be affected by the explosion (and killed if energy becomes zero).
The default power of a bomb is 5. But a piece can be upgraded to make higher power bombs (the bombs set by that particular piece will have higher power). The cost of setting a bomb is 1 wasp and it increases by 1 wasp for each subsequent bomb. Other player's bombs are invisible to the player.

Player's base: The center-cell where each piece of the player starts is the called the base of the player. The vases must be carried here. If an opponent piece attacks another player's base, it will crush one vase (if there are any). It is assumed that the wasps are spread evenly among the vases, so also wasps/vases many wasps are removed. However, the base has a defence and at the end of the players turn all opponent pieces inside the base will be attacked against (and this power is strong enough by default to kill the piece at once if its energy isn't upgraded).
Pieces can be upgraded in the base. Also the base defence value can be upgraded (with any piece inside the base).

Upgrading pieces: Player can upgrade pieces that are in the base during the turn. Attack-upgrade, Energy-upgrade, Bomb power-upgrade. Also, base defence-upgrade can be made by any piece (it doesn't affect the piece itself but the base, but there must a piece inside the base to make it with). Costs of these are defined in Player.prototype.

Winning the game: The winner is the first player to reach the specified number of wasps. In the case this doesn't happen (before maximum number of rounds played), the winner is the player who has the most wasps after a specified maximum number of rounds or after all players have died.

*/


var game = new Game();






