export default(()=>{
  
document.addEventListener('gameStart',e=>{
    
  CS1.myPlayer.setAttribute('dm','');
     
});  

AFRAME.registerComponent('dm', {
  schema: {
    myproperty: {default: true}
  },
  
  init: function(){
    
    CS1.socket.on('dm', d=>{
    
  CS1.log(`${d.name} - ${d.msg}`);
	const m = document.createElement('li');
	m.innerHTML=`<font color="red">${d.name}</font> - ${d.msg}`;
	document.querySelector('#messages').appendChild(m);


    });
    
  },
  
  send: function(msg,name){
       
     CS1.socket.emit('dm',{msg:msg,name:name});
  
  }
  
});
  
})()