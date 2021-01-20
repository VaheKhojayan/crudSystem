let articleDeletes=document.querySelectorAll('.delete');

for (let delbtn of articleDeletes){
	delbtn.addEventListener('click', (e) => {
		e.preventDefault();
        
		let objItem={_id:delbtn.id};


		fetch('/user/deletearticle',{
		method:'DELETE',
		headers:{
			'Content-Type':'application/JSON',
			'Accept':'application/JSON'
		},
		body:JSON.stringify(objItem)
	}).then(res => res.json())
	  .then(result => {
	  	 if(result.del==1){
	  	 	
	  	delbtn.parentNode.parentNode.remove()
	  	
	  }

	  })

	})
}