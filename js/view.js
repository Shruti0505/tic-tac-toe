export default class View{

    $= {} ;
    $$={};



    constructor() {
       this.$.menu=this.#qs(' [data-id= "menu"]');
       this.$.menuBtn=this.#qs('[data-id="menu-btn"]');
       this.$.menuItems= this.#qs(".items");
       this.$.resetBtn= this.#qs('[data-id="reset-btn"]');
       this.$.newRoundBtn= this.#qs(' [data-id= "new-round-btn"]');
       this.$.modal= this.#qs('[data-id="modal"]');
        this.$.modalText= this.#qs('[data-id="modal-text"]');
        this.$.modalBtn= this.#qs('[data-id="modal-btn"]');
        this.$.turn= this.#qs('[data-id="turn"]');
        this.$.p1Wins=this.#qs('[data-id="p1-wins"]');
        this.$.p2Wins=this.#qs('[data-id="p2-wins"]');
        this.$.ties=this.#qs('[data-id="ties"]');

       this.$$.squares= this.#qsAll('[data-id= "square"]');


        //UI-only event listeners
        this.$.menuBtn.addEventListener("click" , event=>{
            this.#toggleMenu();
        });  
    }

    // register all event listeners

    bindGameResetEvent(handler){
        this.$.resetBtn.addEventListener("click", handler);
        this.$.modalBtn.addEventListener("click",handler);
    }

    bindNewRoundEvent(handler){
        this.$.newRoundBtn.addEventListener("click" ,handler);
    }

    bindPlaterMoveEvent(handler){
        this.$$.squares.forEach(square => {
            square.addEventListener("click" , ()=> handler(square));
        });
    }

    // dom helper methods

    updateScoreboard(p1Wins, p2Wins,ties){
        this.$.p1Wins.innerText=`${p1Wins} wins!`;
        this.$.p2Wins.innerText=`${p2Wins} wins!`;
        this.$.ties.innerText=`${ties} Tie!`;

    }

    openModal(message){
        this.$.modal.classList.remove("hidden");
        this.$.modalText.innerText=message;
    }
    closeAll(){
        this.#closeModal();
        this.#closeMenu();
    }
    
    clearMoves(){
        this.$$.squares.forEach(square=>{
            square.replaceChildren();
        })
    }

    initializeMoves(moves){
        this.$$.squares.forEach(square=> {
            const existingMove = moves.find(move=> move.squareId === +square.id)
            if(existingMove){
                this.handlePlayerMove(square, existingMove.player)
            }
        });
    }

    
    #closeModal(){
        this.$.modal.classList.add("hidden");
    }

    #closeMenu(){
        this.$.menuItems.classList.add("hidden");
        this.$.menuBtn.classList.remove("border");

        const icon = this.$.menuBtn.querySelector("i");
        icon.classList.add("fa-chevron-down");
        icon.classList.remove("fa-chevron-up");

    }

    #toggleMenu(){
        this.$.menuItems.classList.toggle("hidden");
        this.$. menuBtn.classList.toggle("border");

       const icon = this.$.menuBtn.querySelector("i");

       icon.classList.toggle("fa-chevron-down");
       icon.classList.toggle("fa-chevron-up");

    }

    handlePlayerMove(squareEl,player){
        const icon=document.createElement("i");
        icon.classList.add(
            "fa-solid",
           player.iconClass,
           player.colorClass
        )
        squareEl.replaceChildren(icon);
    }

    //turn
    setTurnIndicator(player){
        const icon= document.createElement("i");
        const label=document.createElement("p");

        icon.classList.add("fa-solid", player.colorClass, player.iconClass);

        label.classList.add(player.colorClass);
        label.innerText=`${player.name}, you are up!`;

        this.$.turn.replaceChildren(icon,label);
    }
    

    #qs(selector,parent){
        const el = parent? parent.querySelector(selector) :document.querySelector(selector);

        if(!el) throw new Error ("Could not find element");
        return el;
    }

    #qsAll(selector){
        const elList =document.querySelectorAll(selector);

        if(!elList) throw new Error ("Could not find element");
        return elList;
    }
    
}