const Koa = require('koa')
const router = require('koa-router')()
const server = require('koa-static')('./static')
const app = new Koa()

const KoaWebMonetization = require('koa-web-monetization')
const monetization = new KoaWebMonetization({ maxBalance: 25 });

const fs = require('fs-extra')
const path = require('path')

router.get('/client.js', async ctx => {
  ctx.body = await fs.readFile(path.resolve(__dirname, 'node_modules/koa-web-monetization/client.js'))
})
// This is the SPSP endpoint that lets you receive ILP payments.  Money that
// comes in is associated with the :id
router.get('/pay/:id', monetization.receiver());

// This endpoint charges 100 units to the user with :id
// If awaitBalance is set to true, the call will stay open until the balance is sufficient. This is convenient
// for making sure that the call doesn't immediately fail when called on startup.
router.get('/content/:id/:recipe_name', monetization.paid({ price: 25, awaitBalance: true }), async ctx => {
  // load content by :content_id
  console.log("ctx", ctx);
  ctx.body = ctx.params.recipe_name;

});

app
  .use(router.routes())
  .use(router.allowedMethods())
  .use(server)
  .listen(8080)
