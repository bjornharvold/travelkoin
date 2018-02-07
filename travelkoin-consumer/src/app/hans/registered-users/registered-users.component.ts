import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../core/user.service';
import {User} from '../../model/user';

@Component({
  selector: 'app-hans-registered-users',
  templateUrl: './registered-users.component.html',
  styleUrls: ['./registered-users.component.scss']
})
export class RegisteredUsersComponent implements OnInit, OnDestroy {
    private alive = true;
    limit: number = 25;
    list: Array<User> = [];

    private listUsers(): void {
        this.userService.list(this.limit, false, false, false)
            .takeWhile(() => this.alive)
            .subscribe((list: Array<User>) => {
                this.list = list;
            })
    }

    ngOnDestroy() {
        this.alive = false;
    }

    ngOnInit() {
        this.listUsers();
    }

    constructor(private userService: UserService) {
    }
}
