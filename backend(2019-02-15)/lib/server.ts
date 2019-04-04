import app from "./app";
// const PORT = 3000;
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
})