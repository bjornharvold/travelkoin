import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserSessionService} from '../../core/user-session.service';
import {User} from '../../model/user';
import {takeWhile} from 'rxjs/operators';

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
        this.userSessionService.getUser().pipe(
            takeWhile(() => this.alive))
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
