const puppeteer = require('puppeteer');
const express = require('express')
const app = express()

app.get('/test', async (req, res) => {
  const data = await searchData()
  res.send({data})
})

app.listen(3000, () => {
    console.log(`Server listening on port 3000`)
})

const searchData = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    await page.goto('https://webscraper.io/test-sites/e-commerce/allinone/computers/laptops');

    const elements = await page.$$('body > div.wrapper > div.container.test-site > div.row > div.col-md-9 > div.row > div.col-sm-4.col-lg-4.col-md-4')
    let produtos = []
    for(const element of elements) {
        const productTitle = await page.evaluate(el => el.querySelector("div > div.caption > h4:nth-child(2) > a").textContent, element)
        if(productTitle.includes('Lenovo')) {
            const productPrice = await page.evaluate(el => el.querySelector("div > div.caption > h4.pull-right.price").textContent, element)
            const productDescription = await page.evaluate(el => el.querySelector("div > div.caption > p").textContent, element)
            const productReviews = await page.evaluate(el => el.querySelector("div > div.ratings > p.pull-right").textContent, element)
            const productRating = await page.evaluate(el => el.querySelector("div > div.ratings > p:nth-child(2)").getAttribute("data-rating"), element)
            const productImage = await page.evaluate(el => el.querySelector("div > div.thumbnail > img").getAttribute("src"), element)
            produtos.push({
                productTitle,
                productPrice,
                productDescription,
                productReviews,
                productRating,
                productImage
            })
        }
    }
    const productsOrder = produtos.sort(function(a,b) {
        return a.productPrice - b.productPrice
    })
    return productsOrder
};