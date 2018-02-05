import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../core/user.service';
import {User} from '../../model/user';

@Component({
    selector: 'app-hans-users-by-status',
    templateUrl: './users-by-status.component.html',
    styleUrls: ['./users-by-status.component.scss']
})
export class UsersByStatusComponent implements OnInit, OnDestroy {
    private alive = true;
    @Input() approved = false;
    @Input() submittedDocuments = false;
    @Input() blocked = false;
    limit: number = 25;
    list: Array<User> = [];

    private listUsers(): void {
        this.userService.list(this.limit, this.approved, this.submittedDocuments, this.blocked)
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
