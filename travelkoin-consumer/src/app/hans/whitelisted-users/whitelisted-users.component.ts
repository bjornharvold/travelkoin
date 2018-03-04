import {Component, OnDestroy, OnInit} from '@angular/core';
import {ImprovedMultimedia} from '../../model/improved-multimedia';
import {User} from '../../model/user';
import {UserService} from '../../core/user.service';

@Component({
  selector: 'app-hans-whitelisted-users',
  templateUrl: './whitelisted-users.component.html',
  styleUrls: ['./whitelisted-users.component.scss']
})
export class WhitelistedUsersComponent implements OnInit, OnDestroy {
    private alive = true;
    list: Array<User> = [];
    openModalButtonClicked = false;
    modalImage: ImprovedMultimedia = null;

    private listUsers(): void {
        this.userService.listWhitelisted()
            .takeWhile(() => this.alive)
            .subscribe((list: Array<User>) => {
                this.list = list;
            })
    }

    openModal(mm: ImprovedMultimedia): void {
        this.modalImage = mm;
        this.openModalButtonClicked = true;
    }

    closeModal(): void {
        this.openModalButtonClicked = false;
        this.modalImage = null;
    }

    toggleBlockUser(index: number): void {
        const user: User = this.list[index];
        this.userService.toggleBlockUser(user);
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
