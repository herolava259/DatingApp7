import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions, NgxGalleryComponent, NgxGalleryModule } from '@kolkov/ngx-gallery';
import { Member } from 'app/_models/member';
import { MembersService } from 'app/_services/members.service';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TimeagoModule } from 'ngx-timeago';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
  imports: [CommonModule, TabsModule, GalleryModule, NgxGalleryModule, TimeagoModule]
})
export class MemberDetailComponent implements OnInit {
  member: Member | undefined;
  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];

  images: GalleryItem[] = [];
  constructor(private memberService: MembersService, private route: ActivatedRoute){}

  ngOnInit(): void {
    this.loadMember();

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

  loadMember(){
    const username = this.route.snapshot.paramMap.get('username');

    if(!username) return ;

    this.memberService.getMember(username).subscribe({
      next: member => 
      {
        this.member = member;
        this.getImages();
        // this.galleryImages = this.getGalleryImages();
      },
    });
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
}
