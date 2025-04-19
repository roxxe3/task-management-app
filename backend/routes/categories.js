const tasksRouter = require("./routes/tasks");
const categoriesRouter = require("./routes/categories");

app.use("/api/tasks", tasksRouter);
app.use("/api/categories", categoriesRouter);
