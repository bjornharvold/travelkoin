import {Injectable} from '@angular/core';
import {Mandrill} from 'mandrill-api';
import {environment} from '../../environments/environment';

@Injectable()
export class MandrillService {
    private templateName = 'travelkoin-ico-approval';
    private mandrill: mandrill.Mandrill;

    sendEmail(email: string): void {
        const message: any = {
            subject: 'You have been approved for the Travelkoin ICO',
            from_email: 'info@travelkoin.io',
            from_name: 'Team Travelkoin',
            "to": [{
                "email": email,
                "type": "to"
            }],
        };

        const templateContent: any = [];

        const params: any = {
            template_name: this.templateName,
            template_content: templateContent,
            async: false,
            message: message
        };

        this.mandrill.messages.sendTemplate(params);
    }

    constructor() {
        this.mandrill = new Mandrill(environment.mandrillAPIKey);
    }

}
