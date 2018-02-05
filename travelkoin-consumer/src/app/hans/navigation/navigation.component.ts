import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserSessionService} from '../../core/user-session.service';
import {User} from '../../model/user';

@Component({
  selector: 'app-hans-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {
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

    constructor(private userSessionService: UserSessionService) {
    }
}
