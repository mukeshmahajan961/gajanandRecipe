import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  userName: string | null = "";
  constructor(private route: ActivatedRoute) { }
  ngOnInit(): void {
    // let name = this.route.snapshot.paramMap.get('name');
    // this.userName = name
    // this.route.queryParams.subscribe(params => {
    //   this.userName = params['name'];
    // })

    // this.route.data.subscribe(data => {
    //   console.log(data);
    //   this.userName = data['name'];

    // })

 

  }

}
