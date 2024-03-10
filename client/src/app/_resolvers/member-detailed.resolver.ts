import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Member } from 'app/_models/member';
import { MembersService } from 'app/_services/members.service';

export const memberDetailedResolver: ResolveFn<Member> = (route, state) => {
  const memberService = inject(MembersService);

  return memberService.getMember(route.paramMap.get('username')!)
};
