import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileData: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem("jwtToken");

    this.http.get('https://localhost:5000/api/Profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .subscribe({
      next: (res) => {
        console.log("Profile data:", res);
        this.profileData = res;
      },
      error: (err) => {
        console.error("Unauthorized:", err);
        alert("You must be logged in to view profile.");
      }
    });
  }
}
