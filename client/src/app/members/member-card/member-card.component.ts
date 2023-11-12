import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Member } from 'app/_models/member';


@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css'],
})
export class MemberCardComponent implements OnInit {

  @Input() member: Member | undefined;

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
