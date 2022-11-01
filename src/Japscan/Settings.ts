import {
    NavigationButton,
    SourceStateManager
} from "paperback-extensions-common";

import {
    retrieveStateData,
    setStateData
} from "./Common";

export const serverSettingsMenu = (
    stateManager: SourceStateManager
): NavigationButton => {
    return createNavigationButton({
        id: "server_settings",
        value: "",
        label: "Server Settings",
        form: createForm({
            onSubmit: async (values: any) => setStateData(stateManager, values),
            validate: async () => true,
            sections: async () => [
                createSection({
                    id: "information",
                    header: undefined,
                    rows: async () => [
                        createMultilineLabel({
                            label: "Scrap Server",
                            value: "Download and deploy the project :\n\nhttps://github.com/Moomooo95/shadow-of-babel\n\nRead README.md to know how to deploy the server.\n\nNote: The use of this server is MANDATORY otherwise the images of the chapters cannot be recovered",
                            id: "description",
                        }),
                    ],
                }),
                createSection({
                    id: "serverSettings",
                    header: "Server Settings",
                    footer: undefined,
                    rows: async () => retrieveStateData(stateManager).then((values) => [
                        createInputField({
                            id: "serverAddress",
                            label: "Server URL",
                            placeholder: "http://127.0.0.1:3000",
                            value: values.serverURL,
                            maskInput: false,
                        }),
                    ]),
                }),
            ],
        }),
    });
};