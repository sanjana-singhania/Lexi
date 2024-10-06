@component

export class NewScript extends BaseScriptComponent {

    remoteServiceModule = require('LensStudio:RemoteServiceModule');
    //temp specID: 363ee2a5-ad35-4a5f-9547-d42b2c60a927
    
    @input()
    authKey : string;
    
    onAwake() {
        this.remoteServiceModule.apiSpecId = '363ee2a5-ad35-4a5f-9547-d42b2c60a927';//'http';//'363ee2a5-ad35-4a5f-9547-d42b2c60a927';
        this.createEvent("TapEvent").bind(() => {
            this.translateText('Hello', 'ZH-HANS')
        })
        //this.translateText('Hello good morning', 'ZH-HANS');
    }

    translateText(text: string, targetLang: string) {
        const url: string = 'https://api-free.deepl.com/v2/translate';
        print("api spec id: " + this.remoteServiceModule.apiSpecId) // TODO - REMOVE

        const queryParams = `?auth_key=${this.authKey}&text=${encodeURIComponent(text)}&target_lang=${targetLang}`;

        let httpRequest = RemoteServiceHttpRequest.create();
        httpRequest.url = url + queryParams;
        print('url: ' + httpRequest.url) // TODO - REMOVE
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
    }
    
}




