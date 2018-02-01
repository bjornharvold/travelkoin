import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../model/user';
import {UserSessionService} from '../../core/user-session.service';

@Component({
    selector: 'app-secure-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
    private alive = true;
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
                    }
                },
                error => console.warn(error)
            );
    }

    constructor(private readonly userSessionService: UserSessionService) {
    }
}
