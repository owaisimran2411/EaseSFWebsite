document.getElementById('search-product-form').addEventListener('submit', async (event) => {
    const filters = JSON.parse(sessionStorage.getItem('filters') || '{}');
    const filterData = { ...filters, "searchBox": document.getElementById('searchFilterInput').value }
    console.log(document.getElementById('searchFilterInput').value)
    sessionStorage.setItem('filters', JSON.stringify(filterData))


})
document.getElementById('filterCategory').addEventListener('change', async (event) => {
    const filters = JSON.parse(sessionStorage.getItem('filters') || '{}');
    if ("category" in filters) {
        const filterData = { ...filters, "category": event.target.value }
        console.log(filterData)
        sessionStorage.setItem('filters', JSON.stringify(filterData))
    } else {
        const filterData = { ...filters }
        console.log(filterData)
        filterData.category = event.target.value
        sessionStorage.setItem('filters', JSON.stringify(filterData))
    }

    await fetch(`/user/advance-filters`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(JSON.parse(sessionStorage.getItem('filters')))
    }).then((res) => {
        return res.json()
    })
        .then((data) => {
            // console.log(data)
            const ids = []

            for (let i = 0; i < data.length; i++) {
                ids.push(data[i]._id)
            }
            // console.log(ids)
            const allProductCards = document.querySelectorAll('[data-product-id]')
            for (let i = 0; i < allProductCards.length; i += 2) {
                // allProductCards[i].style.display = 'flex'
                const subCard = allProductCards[i].getAttribute('data-product-id')
                let isValid = false
                for (let j = 0; j < ids.length; j++) {
                    if (subCard == ids[j]) {
                        isValid = true
                    }
                }
                if (!isValid) {
                    // allProductCards[i].closest(".col-md-3").remove()
                    allProductCards[i].closest('.col-md-3').style.display = 'none'
                    allProductCards[i].closest('.col-md-3').style.transition = "opacity 0.5s";
                    allProductCards[i].closest('.col-md-3').style.opacity = "0";
                    setTimeout(() => allProductCards[i].closest('.col-md-3').style.display = "none", 500); // Hide after fade-out
                } else {
                    allProductCards[i].closest('.col-md-3').style.display = 'block'
                    setTimeout(() => allProductCards[i].closest('.col-md-3').style.opacity = "1", 10); // Fade-in effect
                }
            }

        })
})