"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
// adds one specific role to have the prediction admin privelege. Scrapes the roles and adds them all.
const predictionUserInit = {
    data: new builders_1.SlashCommandBuilder().setName("prediction-admin-role").setDescription("Sets a new prediction-admin role"),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
};
exports.default = predictionUserInit;
