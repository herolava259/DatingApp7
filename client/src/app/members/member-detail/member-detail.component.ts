import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions, NgxGalleryComponent, NgxGalleryModule } from '@kolkov/ngx-gallery';
import { Member } from 'app/_models/member';
import { Message } from 'app/_models/message';
import { MembersService } from 'app/_services/members.service';
import { MessageService } from 'app/_services/message.service';
import { MemberMessagesComponent } from 'app/memebers/member-messages/member-messages.component';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TabDirective, TabsModule, TabsetComponent } from 'ngx-bootstrap/tabs';
import { TimeagoModule } from 'ngx-timeago';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
  imports: [CommonModule, TabsModule, GalleryModule, NgxGalleryModule, TimeagoModule, MemberMessagesComponent]
})
export class MemberDetailComponent implements OnInit {

  @ViewChild('memberTabs', {static: true}) memberTabs?: TabsetComponent;

  
  member: Member = {} as Member;
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];

  images: GalleryItem[] = [];
  activeTab?: TabDirective;

  messages: Message[] = []; 

  constructor(private memberService: MembersService, private route: ActivatedRoute,
              private messageService: MessageService){}

  ngOnInit(): void {

    this.route.data.subscribe({
      next: data => this.member = data['member']
    })
    //this.loadMember();

    this.route.queryParams.subscribe({
      next: params => {
        params['tab'] && this.selectTab(params['tab']) 
      }
    });

    this.getImages();
    // this.galleryOptions = [
    //   {
    //     width: '500px',
    //     height: '500px',
    //     imagePercent: 100,
    //     thumbnailsColumns: 4,
    //     imageAnimation: NgxGalleryAnimation.Slide,
    //     preview: false
    //   }
    // ];

    // this.galleryImages = this.getGalleryImages();
  }

  // getGalleryImages()
  // {
  //   if(!this.member)
  //   {
  //     return [];
  //   }

  //   const imageUrls = [];

  //   for(const photo of this.member.photos){
  //     imageUrls.push({
  //       small: photo.url,
  //       medium: photo.url,
  //       big: photo.url
  //     })
  //   }

  //   return imageUrls;
  // }

  onTabActivated(data: TabDirective)
  {
    this.activeTab = data;

    if(this.activeTab.heading === 'Messages')
    {
      this.loadMessages();
    }
  }

  getImages()
  {
    if(!this.member) return;

    for(const photo of this.member?.photos)
    {
      this.images.push(new ImageItem({src: photo.url, thumb: photo.url}));
      this.images.push(new ImageItem({src: photo.url, thumb: photo.url}));
    }
  }

  loadMessages(){
    if(this.member)
    {
      this.messageService.getMessageThread(this.member.userName).subscribe({
        next: messages => this.messages = messages
      })
    }
  }

  selectTab(heading: string)
  {
    if(this.memberTabs)
    {
      this.memberTabs.tabs.find(x => x.heading === heading)!.active == true;
    }
  }

  
  // loadMember(){
  //   const username = this.route.snapshot.paramMap.get('username');

  //   if(!username) return ;

  //   this.memberService.getMember(username).subscribe({
  //     next: member => 
  //     {
  //       this.member = member;
  //       this.getImages();
  //       // this.galleryImages = this.getGalleryImages();
  //     },
  //   });
  // }

}
