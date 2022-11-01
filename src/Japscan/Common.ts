import {
    SourceStateManager
} from "paperback-extensions-common";

const DEFAULT_SCRAP_SERVER_ADDRESS = 'https://127.0.0.1:3000'

export async function retrieveStateData(stateManager: SourceStateManager) {
    // Return serverURL saved in the source.
    // Used to show already saved data in settings

    const serverURL = (await stateManager.retrieve('serverAddress') as string) ?? DEFAULT_SCRAP_SERVER_ADDRESS

    return { serverURL }
}

export async function setStateData(stateManager: SourceStateManager, data: Record<string, any>) {
    await setScrapServerAddress(
        stateManager,
        data['serverAddress'] ?? DEFAULT_SCRAP_SERVER_ADDRESS
    )
}

async function setScrapServerAddress(stateManager: SourceStateManager, apiUri: string) {
    await stateManager.store('serverAddress', apiUri)
}

export async function getScrapServerURL(stateManager: SourceStateManager): Promise<string> {
    return (await stateManager.retrieve('serverAddress') as string | undefined) ?? DEFAULT_SCRAP_SERVER_ADDRESS
}