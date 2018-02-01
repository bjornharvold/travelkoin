import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../model/user';
import {UserSessionService} from '../../core/user-session.service';

@Component({
    selector: 'app-secure-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {
    private alive = true;
    private disabled = false;
    user: User = null;

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        this.userSessionService.getUser()
            .takeWhile(() => this.alive)
            .subscribe((user: User) => {
                    if (user != null) {
                        this.user = user;
                        if (user != null && user.needsRegistration) {
                            this.disabled = true;
                        }
                    }
                },
                error => console.warn(error)
            );
    }

    constructor(private userSessionService: UserSessionService) {
    }
}
