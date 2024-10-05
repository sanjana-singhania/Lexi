@component

export class NewScript extends BaseScriptComponent {

    remoteServiceModule = require('LensStudio:RemoteServiceModule');
    
    @input()
    authKey : string;
    
    onAwake() {
        this.translateText('Hello good morning', 'ZH-HANS');
    }

    private translateText(text: string, targetLang: string) : string {
        const url: string = 'https://api-free.deepl.com/v2/translate';

        const queryParams = `?auth_key=${this.authKey}&text=${encodeURIComponent(text)}&target_lang=${targetLang}`;

        let httpRequest = RemoteServiceHttpRequest.create();
        httpRequest.url = url + queryParams;
        httpRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Get;

        print('Sending translation request!');

        let translatedResponse = "";
        this.remoteServiceModule.performHttpRequest(httpRequest, (response) => {
            if (response.statusCode === 200) {
                print('Translation success!');
                print('Response body: ' + response.body);
                translatedResponse = response.body;
                // TODO - need to change the body to get only the text
            } else {
                print('Translation failed with status: ' + response.statusCode);
                translatedResponse = "an error occurred"
            }
        });
        return translatedResponse
    }
    
}




