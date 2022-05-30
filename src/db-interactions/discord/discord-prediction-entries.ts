import { addNewDiscordPredictionEntry, updateDiscordPredictionEntry } from "./discord-transactions";

// returns null on failure to update prediction
export const addNewPredictionEntry = async (predictionId: string, userId: string, guildId: string, wageredPoints: number, predicted_outcome: string) => {
    try {
        const newEntry = await addNewDiscordPredictionEntry(predictionId, userId, guildId, wageredPoints, predicted_outcome);
        return newEntry;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export const updatePredictionEntry = async(predictionId: string, userId: string, guildId: string, wageredPoints: number, predicted_outcome: string)=> {
    try {
        const updatedEntry = await updateDiscordPredictionEntry(predictionId, userId, guildId, wageredPoints, predicted_outcome);
        return updatedEntry;
    }catch (e) {
        console.error('error updating the prediction entry');
        console.error(e);
        return null;
    }
}