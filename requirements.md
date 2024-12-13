Overview:
Title - Memory checker
Summary: Card game where player needs to find all card pairs. Every card has dublicate randomly allocated. Player have certain amount of time to find all pairs. Players can level up, after certain levels more cards will be displyd, less time they will have to gues.
Genre - puzzle

GENERAL Functional Requirements:

1.  Game should have "Start" button, which starts the game from level 1
2.  Game should have levels
3.  game should have status screen: current level, time left, pairs left to find out of pairs in total.
4.  Game shoudl have main game part, where user can interact with cards.
5.  Game should have - you won screen after every level.
6.  (additional) game should have music in loop.
7.  Cards should be placed randomly on the screen.
8.  Game should have 'audio off' option
9.  (additional) add timer slider

LEVELS:

1.  Demo level: 8 cards(4 pairs) and 20 sec. to gues.

pixel icons:
https://www.streamlinehq.com/icons/pixel?search=&icon=ico_MYz60u8dEw7QGUgf

<!-- GAME PROCESS -->

STARTS THE GAME:

1.  CREATE random array from 0 to x (for each card)
2.  insert cards with for loop. (from 0 to x index from that loop)
3.  all cards at first should be opened for 3sec (element inside the cards should be set to displau: inline block)
4.  after 3 sec. add display: none to all the cards.
5.  player can open 2 cards, if cards matches, they are opened and colored green, if not, they are closed (display: none)
6.  message is shown:
    1.  If no time is left 'GAME OVER, button - go back to start'
    2.  If player wins a game 'CONGRADS, YOU WON THE GAME! same button'
    3.  If player wins level 'Level complete' 2 buttons go to the next level or go back to main menu.
