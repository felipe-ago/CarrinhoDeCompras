// criar a variável modalKey sera global
let modalKey = 0

// variavel para controlar a quantidade inicial de produtos na modal
let quantProdutos = 1

let carrinho = [] // carrinho

// funcoes auxiliares ou uteis
const seleciona = (elemento) => document.querySelector(elemento)
const selecionaTodos = (elemento) => document.querySelectorAll(elemento)

const formatoReal = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const formatoMonetario = (valor) => {
    if(valor) {
        return valor.toFixed(2)
    }
}

const abrirModal = () => {
    seleciona('.produtoJanelaArea').style.opacity = 0 // transparente
    seleciona('.produtoJanelaArea').style.display = 'flex'
    setTimeout(() => seleciona('.produtoJanelaArea').style.opacity = 1, 150)
}

const fecharModal = () => {
    seleciona('.produtoJanelaArea').style.opacity = 0 // transparente
    setTimeout(() => seleciona('.produtoJanelaArea').style.display = 'none', 500)
}

const botoesFechar = () => {
    // BOTOES FECHAR MODAL
    selecionaTodos('.produtoInfo-cancelarButton, .produtoInfo-cancelarMobileButton').forEach( (item) => item.addEventListener('click', fecharModal) )
}

const preencheDadosDosProdutos = (produtoItem, item, index) => {
    // setar um atributo para identificar qual elemento foi clicado
	produtoItem.setAttribute('data-key', index)
    produtoItem.querySelector('.produtos-lista-img img').src = item.img
    produtoItem.querySelector('.produtos-lista-preco').innerHTML = formatoReal(item.price[2])
    produtoItem.querySelector('.produtos-lista-name').innerHTML = item.name
    produtoItem.querySelector('.produtos-lista-desc').innerHTML = item.description
}

const preencheDadosModal = (item) => {
    seleciona('.produtoGrande img').src = item.img
    seleciona('.produtoInfo h1').innerHTML = item.name
    seleciona('.produtoInfo-desc').innerHTML = item.description
    seleciona('.produtoInfo-precoAtual').innerHTML = formatoReal(item.price[2])
}

const pegarKey = (e) => {
    // .closest retorna o elemento mais proximo que tem a class que passamos
    // do .produtos-lista ele vai pegar o valor do atributo data-key
    let key = e.target.closest('.produtos-lista').getAttribute('data-key')
    console.log('Produto clicado ' + key)
    console.log(produtoJson[key])

    // garantir que a quantidade inicial de produtos é 1
    quantProdutos = 1

    // Para manter a informação de qual produto foi clicado
    modalKey = key

    return key
}

const mudarQuantidade = () => {
    // Ações nos botões + e - da janela modal
    seleciona('.produtoInfo-qtmais').addEventListener('click', () => {
        quantProdutos++
        seleciona('.produtoInfo-qt').innerHTML = quantProdutos
    })

    seleciona('.produtoInfo-qtmenos').addEventListener('click', () => {
        if(quantProdutos > 1) {
            quantProdutos--
            seleciona('.produtoInfo-qt').innerHTML = quantProdutos	
        }
    })
}

const adicionarNoCarrinho = () => {
    seleciona('.produtoInfo-addButton').addEventListener('click', () => {
        console.log('Adicionar no carrinho')

        // pegar dados da janela modal atual
    	// qual produto? pegue o modalKey para usar produtoJson[modalKey]
    	console.log("Produto " + modalKey)
    	// quantidade
    	console.log("Quant. " + quantProdutos)
        // preco
        let price = seleciona('.produtoInfo-precoAtual').innerHTML.replace('R$&nbsp;', '')
    
        // crie um identificador para colocar a id
	    let identificador = produtoJson[modalKey].id

        // antes de adicionar verifique se ja tem aquele codigo para adicionarmos a quantidade
        let key = carrinho.findIndex( (item) => item.identificador == identificador )
        console.log(key)

        if(key > -1) {
            // se encontrar aumente a quantidade
            carrinho[key].qt += quantProdutos
        } else {
            // adicionar objeto produto no carrinho
            let produto = {
                identificador,
                id: produtoJson[modalKey].id,
                qt: quantProdutos,
                price: parseFloat(price) // price: price
            }
            carrinho.push(produto)
            console.log(produto)
            console.log('Sub total R$ ' + (produto.qt * produto.price).toFixed(2))
        }

        fecharModal()
        abrirCarrinho()
        atualizarCarrinho()
    })
}

const abrirCarrinho = () => {
    console.log('Qtd de itens no carrinho ' + carrinho.length)
    if(carrinho.length > 0) {
        // mostrar o carrinho
	    seleciona('aside').classList.add('show')
        seleciona('header').style.display = 'flex' // mostrar barra superior
    }

    // exibir aside do carrinho no modo mobile
    seleciona('.menu').addEventListener('click', () => {
        if(carrinho.length > 0) {
            seleciona('aside').classList.add('show')
            seleciona('aside').style.left = '0'
        }
    })
}

const fecharCarrinho = () => {
    // fechar o carrinho com o botão X no modo mobile
    seleciona('.menu-fechar').addEventListener('click', () => {
        seleciona('aside').style.left = '100vw' // usando 100vw ele ficara fora da tela
        seleciona('header').style.display = 'flex'
    })
}

const atualizarCarrinho = () => {
    // exibir número de itens no carrinho
	seleciona('.menu span').innerHTML = carrinho.length
	
	// mostrar ou nao o carrinho
	if(carrinho.length > 0) {

		// mostrar o carrinho
		seleciona('aside').classList.add('show')

		// zerar meu .carrinho para nao fazer insercoes duplicadas
		seleciona('.carrinho').innerHTML = ''

        // crie as variaveis antes do for
		let subtotal = 0
		let desconto = 0
		let total    = 0

        // para preencher os itens do carrinho, calcular subtotal
		for(let i in carrinho) {
			// use o find para pegar o item por id
			let produtoItem = produtoJson.find( (item) => item.id == carrinho[i].id )
			console.log(produtoItem)

            // em cada item pegar o subtotal
        	subtotal += carrinho[i].price * carrinho[i].qt
            //console.log(carrinho[i].price)

			// fazer o clone, exibir na telas e depois preencher as informacoes
			let carrinhoItem = seleciona('.produtos .carrinho-lista').cloneNode(true)
			seleciona('.carrinho').append(carrinhoItem)

			let produtoNome = `${produtoItem.name})`

			// preencher as informacoes
			carrinhoItem.querySelector('img').src = produtoItem.img
			carrinhoItem.querySelector('.carrinho-lista-nome').innerHTML = produtoNome
			carrinhoItem.querySelector('.carrinho-lista-qt').innerHTML = carrinho[i].qt

			// selecionar botoes + e -
			carrinhoItem.querySelector('.carrinho-lista-qtmais').addEventListener('click', () => {
				console.log('Clicou no botão mais')
				// adicionar apenas a quantidade que esta neste contexto
				carrinho[i].qt++
				// atualizar a quantidade
				atualizarCarrinho()
			})

			carrinhoItem.querySelector('.carrinho-lista-qtmenos').addEventListener('click', () => {
				console.log('Clicou no botão menos')
				if(carrinho[i].qt > 1) {
					// subtrair apenas a quantidade que esta neste contexto
					carrinho[i].qt--
				} else {
					// remover se for zero
					carrinho.splice(i, 1)
				}

                (carrinho.length < 1) ? seleciona('header').style.display = 'flex' : ''

				// atualizar a quantidade
				atualizarCarrinho()
			})

			seleciona('.carrinho').append(carrinhoItem)

		} // fim do for

		// fora do for
		// calcule desconto 10% e total
		//desconto = subtotal * 0.1
		desconto = subtotal * 0
		total = subtotal - desconto

		// exibir na tela os resultados
		// selecionar o ultimo span do elemento
		seleciona('.subtotal span:last-child').innerHTML = formatoReal(subtotal)
		seleciona('.desconto span:last-child').innerHTML = formatoReal(desconto)
		seleciona('.total span:last-child').innerHTML    = formatoReal(total)

	} else {
		// ocultar o carrinho
		seleciona('aside').classList.remove('show')
		seleciona('aside').style.left = '100vw'
	}
}

const finalizarCompra = () => {
    seleciona('.carrinho-finalizar').addEventListener('click', () => {
        console.log('Finalizar compra')
        seleciona('aside').classList.remove('show')
        seleciona('aside').style.left = '100vw'
        seleciona('header').style.display = 'flex'
    })
}

// MAPEAR produtoJson para gerar lista de produto
produtoJson.map((item, index ) => {
    //console.log(item)
    let produtoItem = document.querySelector('.produtos .produtos-lista').cloneNode(true)
    //console.log(produtoItem)
    //document.querySelector('.produto-area').append(produtoItem)
    seleciona('.produto-area').append(produtoItem)

    // preencher os dados de cada produto
    preencheDadosDosProdutos(produtoItem, item, index)
    
    // produto clicado
    produtoItem.querySelector('.produtos-lista a').addEventListener('click', (e) => {
        e.preventDefault()
        console.log('Clicou no produto')

        let chave = pegarKey(e)

        // abrir janela modal
        abrirModal()

        // preenchimento dos dados
        preencheDadosModal(item)

        // definir quantidade inicial como 1
		seleciona('.produtoInfo-qt').innerHTML = quantProdutos

    })

    botoesFechar()

}) // fim do MAPEAR produtoJson para gerar lista de produtos


// mudar quantidade com os botoes + e -
mudarQuantidade()

adicionarNoCarrinho()
atualizarCarrinho()
fecharCarrinho()
finalizarCompra()
