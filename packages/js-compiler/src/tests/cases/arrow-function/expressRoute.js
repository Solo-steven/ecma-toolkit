app.post("/", async (req, rep) => {
    const data = await someAsyncComputed(req.params);
    return rep.json({
        data
    });
})