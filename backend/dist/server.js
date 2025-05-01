"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = require("./routers/auth.routes");
const category_routes_1 = require("./routers/category.routes");
const comment_routes_1 = require("./routers/comment.routes");
const favourite_routes_1 = require("./routers/favourite.routes");
const history_routes_1 = require("./routers/history.routes");
const problem_routes_1 = require("./routers/problem.routes");
const project_structure_routes_1 = require("./routers/project.structure.routes");
const psg_routes_1 = require("./routers/psg.routes");
const solution_routes_1 = require("./routers/solution.routes");
const stack_routes_1 = require("./routers/stack.routes");
const user_routes_1 = require("./routers/user.routes");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const chat_routes_1 = require("./routers/chat.routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, express_1.json)());
app.use((0, cors_1.default)({
    origin: 'http://localhost:4200',
    credentials: true
}));
app.use((0, cookie_parser_1.default)(process.env.SECRET));
app.use('/auth', auth_routes_1.authRouter);
app.use('/category', category_routes_1.categoryRouter);
app.use('/comment', comment_routes_1.commentRouter);
app.use('/favourite', favourite_routes_1.favouriteRouter);
app.use('/history', history_routes_1.historyRouter);
app.use('/p_structure', project_structure_routes_1.psRouter);
app.use('/psg', psg_routes_1.psgRouter);
app.use('/solution', solution_routes_1.solutionRouter);
app.use('/stack', stack_routes_1.stackRouter);
app.use('/user', user_routes_1.userRouter);
app.use('/problem', problem_routes_1.problemRouter);
app.use('/chats', chat_routes_1.chatRouter);
app.use((err, req, res, next) => {
    res.status(501).json({ message: err.message });
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
// const email = Express();
// email.listen(3001, async () => {
//   console.log("Email server is running on port 3001");
//   cron.schedule('*/10 * * * * *', async () => {
//     // await updateUserBadge();
//     // await welcomeUser();
//     // await notifyAccountTermination();
//     // await notifyAccountDeactivation();
//   console.log("cron job running every 10 seconds");
//   });
// });
