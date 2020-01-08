const addon = {
  name: 'addon',
  init: (socket,state) => {
  
   this.socket = socket;
   this.state = state;
   const self = this;
    
   socket.on('dm',d=>{
   
     const id = Object.keys(state.players).filter(key=>{
             return state.players[key].name == d.name
            });
     if(id)
       socket.broadcast.to(id).emit('dm',{msg:d.msg,name:socket.name});
   
   });

        
  }
  
}
module.exports = addon;