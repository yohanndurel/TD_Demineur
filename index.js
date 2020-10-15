// On require la classe Demineur
import Demineur, {Mine, Num} from './Demineur.js';

const demineur = new Demineur();
const app = new Vue({
  el: '#demineur',
  data: {
    grid : demineur.grid,
    fin : demineur.isGameOver,


  },
  methods: {
    click: function(x, y){
      if(this.fin===0){
        demineur.clicks(x, y);
        this.fin=demineur.isGameOver;
      }
    },

    flag: function(x, y, event){
      if (this.fin===0) {
        demineur.flag(x, y);
        event.preventDefault();
      }
    },
    restart: function (){
      document.location.reload(true)
    },
  }
});
