const cartList = document.querySelector('.cart-items');
    let total = 0;


    document.querySelectorAll('.card .add').forEach(btn => {
      btn.addEventListener('click', function(event) {
        event.preventDefault();
        const card = this.closest('.card');
        const name = card.querySelector('.title').textContent;
        const price = parseInt(card.querySelector('.price').textContent.replace('₱',''));

        const item = document.createElement('div');
        item.className = 'cart-item';
        item.innerHTML = `<span>${name}</span><span>₱${price}</span>`;
        if(cartList.textContent==="Empty cart") cartList.innerHTML='';
        cartList.appendChild(item);

        total += price;
        document.querySelector('.cart div strong:last-child').textContent = `₱${total}`;
      });
    });


    document.querySelector('.checkout button:last-child').addEventListener('click', function() {
      cartList.innerHTML = 'Empty cart';
      total = 0;
      document.querySelector('.cart div strong:last-child').textContent = '₱0';
    });

    function toggleMenu(){
      const menu=document.getElementById('dropMenu');
      menu.style.display = menu.style.display==='block' ? 'none' : 'block';
    }


    const cats = document.querySelectorAll('.cat');
    const cards = document.querySelectorAll('.card');

    cats.forEach(cat => {
      cat.addEventListener('click', () => {
        cats.forEach(c => c.classList.remove('active'));
        cat.classList.add('active');
        const category = cat.textContent;
        cards.forEach(card => {
          if(category === "All" || card.dataset.category === category) {
            card.style.display = "flex";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
