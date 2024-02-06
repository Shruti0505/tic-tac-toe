import Store from "./store.js";
import View from "./view.js";
// const App={
//     $:{
//         menu:document.querySelector(' [data-id= "menu"]'),
//         menuItems: document.querySelector(".items"),
//         resetBtn: document.querySelector('[data-id="reset-btn"]'),
//         newRoundBtn: document.querySelector(' [data-id= "new-round-btn"]'),
//         squares: document.querySelectorAll('[data-id= "square"]'),
//         modal: document.querySelector('[data-id="modal"]'),
//         modalText: document.querySelector('[data-id="modal-text"]'),
//         modalBtn: document.querySelector('[data-id="modal-btn"]'),
//         turn: document.querySelector('[data-id="turn"]')
//     },

//     state:{
//         moves:[],
//     },

//     getGameStatus(moves){

//         const p1Moves= moves.filter(move=>move.playerId===1).map((move)=> +move.squareId);
//         const p2Moves= moves.filter(move=>move.playerId===2).map((move)=> +move.squareId);

//         const winningPatterns=[
//             [1,2,3],
//             [1,5,9],
//             [1,4,7],
//             [2,5,8],
//             [3,5,7],
//             [3,6,9],
//             [4,5,6],
//             [7,8,9]
//         ];
 
//             let winner=null;

//             winningPatterns.forEach(pattern=>{
//                 const p1Wins = pattern.every(v=>p1Moves.includes(v));
//                 const p2Wins=pattern.every(v=>p2Moves.includes(v));

//                 if(p1Wins) winner= 1;
//                 if(p2Wins) winner=2; 
//             });

//         return{
//             status:  moves.length===9 || winner != null ? 'complete' : 'in-progress' ,
//             winner
//         }

//     },

//     init(){
//         App.registerEventListeners();
//     },  

//     registerEventListeners(){

//         //method for menu dropdown
//         App.$.menu.addEventListener("click", (event)=> {
//             App.$.menuItems.classList.toggle("hidden");
//         });

//         //method to reset the game
//         App.$.resetBtn.addEventListener("click", (event)=> {
//             console.log("reset the game");
//         });

//         //method to add a new round
//         App.$.newRoundBtn.addEventListener("click", (event)=> {
//             console.log("add a new round");
//         });

//         //method for play again
//         App.$.modalBtn.addEventListener("click", event=>{
//             App.state.moves=[];
//             App.$.squares.forEach(square=>  square.replaceChildren());
//             App.$.modal.classList.toggle("hidden");
//         })

//         // method for a functional game
//         App.$.squares.forEach(square => {
//             square.addEventListener("click", event=>{

//                 //check if there's already a move in that square
//                 const hasMove=(squareId)=> {
//                     const existingMove= App.state.moves.find(moves => moves.squareId === squareId);
//                     return existingMove!==undefined;
//                 }

//                 if(hasMove(+square.id)){
//                     return;
//                 }

           
//                 //determine which player icon to add to the square
//                const lastMove=App.state.moves[App.state.moves.length-1];
//                 const getOppositePlayer = ((playerId) => {
//                     return playerId===1 ? 2 : 1
//                 }); 
                
//                 const currentPlayer= 
//                 App.state.moves.length===0 
//                     ? 1 
//                     : getOppositePlayer(lastMove.playerId);

                
                
//                 const nextPlayer= getOppositePlayer(currentPlayer);
//                 const turnLabel= document.createElement("p");
//                 turnLabel.innerText=`Player ${nextPlayer} you are up!`;


//                 const squareIcon = document.createElement('i');
//                 const turnIcon = document.createElement('i');



//                 if(currentPlayer=== 1){
//                 squareIcon.classList.add("fa-solid", "fa-x", "yellow");
//                 turnIcon.classList.add("fa-solid", "fa-o", "turqoise");
//                 turnLabel.classList="turqoise";
//                 }else{
//                 squareIcon.classList.add("fa-solid", "fa-o", "turqoise");   
//                 turnIcon.classList.add("fa-solid", "fa-x", "yellow");
//                 turnLabel.classList="yellow";

//                 }

//                 App.$.turn.replaceChildren(turnIcon, turnLabel);

//                 App.state.moves.push({
//                     squareId: +square.id,
//                     playerId:currentPlayer,
//                 });

//                 //to switch players
//                App.state.currentPlayer= currentPlayer===1 ? 2 : 1;

//                 console.log(App.state)
//                 square.replaceChildren(squareIcon);

//                 //check for a win or tie
//                 const game = App.getGameStatus(App.state.moves);

//                 if(game.status=== "complete") {

//                     App.$.modal.classList.toggle("hidden");
//                 // let message="";
//                     if(game.winner){
//                         App.$.modalText.textContent= `Player ${game.winner} wins!`;
//                     }else{
//                         App.$.modalText.textContent="Tie";
//                     }

//                     //App.$.modalText.textContent=message;
//                 }
//             });
//         });

//     },
// };


const players=[
    {
        id:1,
        name : "Player 1",
        iconClass:"fa-x",
        colorClass:"turqoise",
    },
    {
        id:2,
        name : "Player 2",
        iconClass:"fa-o",
        colorClass:"yellow",
    }
];

function init(){
    const view= new View();
    const store= new Store("live-t3-storage-key",players);
    console.log(store.game);

    function initView(){
        view.closeAll();
        view.clearMoves();
        view.setTurnIndicator(store.game.currentPlayer);
        view.updateScoreboard( store.stats.playerWithStats[0].wins, store.stats.playerWithStats[1].wins,store.stats.ties);
    
        view.initializeMoves(store.game.moves)

    }

    //to play in seperate tabs
    window.addEventListener("storage", ()=>{
        console.log("state changed from another tab")
        initView();
    });

    initView();

    view.bindGameResetEvent(event=>{
        store.reset();
        initView();
    })

    
    view.bindNewRoundEvent(event=>{
        store.newRound();
        initView();
    })

    
    view.bindPlaterMoveEvent(square=>{

        const existingMove = store.game.moves.find(move=> move.squareId === +square.id);
        if(existingMove){
            return;
        }

        //place an icon of the current player in a square
        view.handlePlayerMove(square, store.game.currentPlayer);

        //advance to the next state by pushing a move to the moves array
        store.playerMove(+square.id)

        if(store.game.status.isComplete){
            view.openModal(
                store.game.status.winner? `${store.game.status.winner.name} wins!`
                : "Tie!"
            );
            return;
        }

        //set the next player's turn indicator
        view.setTurnIndicator(store.game.currentPlayer);


    })
}
window.addEventListener("load", init);
