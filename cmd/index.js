exports = module.exports = (prog) => {
  process.on('unhandledRejection', function (err) {
    console.error(err)
  })
}
