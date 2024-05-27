- BORRAR LIKES. 20240524
	- Hay que estar en https://twitter.com/YoSoloYoYmiPers/likes
	- Copiar el siguiente script
		- 1.- nextUnlike
		- 2.- wait
		- 3.- removeAll
	- Ejecutar: 
		- removeAll()
	- Obtenido de:
		- https://gist.github.com/aymericbeaumet/d1d6799a1b765c3c8bc0b675b1a1547d
			- jbreckmckye commented on Sep 18, 2023
		- https://github.com/nikolaydubina/twitter-remover

	function nextUnlike() {
		return document.querySelector('[data-testid="unlike"]')
	}
	
	function wait(ms) {
		return new Promise(resolve => setTimeout(resolve, ms))
	}
	
	async function removeAll() {
		let count = 0
		let next = nextUnlike()
		while (next && count < 500) {
			next.focus()
			next.click()
			console.log(`Unliked ${++count} tweets`)
			await wait(count % 50 === 0 ? 30000 : 2000)
			next = nextUnlike()
		}
		if (next) {
			console.log('Finished early to prevent rate-limiting')
		} else {
			console.log('Finished, count =', count)
		}
	}
	
	removeAll()