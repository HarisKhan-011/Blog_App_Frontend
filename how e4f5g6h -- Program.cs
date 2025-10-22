[33mcommit 496634c7dead945f8099ea406eebbce6dbd7e6e2[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mmain[m[33m)[m
Author: e-commerce <aharis0342@gmail.coml>
Date:   Wed Oct 22 22:04:46 2025 +0500

    Initial commit: stable ASP.NET Core 8 version before S3 feature

 angular.json                                       |  17 [32m+[m[31m-[m
 package-lock.json                                  | 483 [32m++++++++++++[m[31m---------[m
 package.json                                       |   9 [32m+[m[31m-[m
 src/app/Adminservice/admin.service.spec.ts         |  16 [32m+[m
 src/app/Adminservice/admin.service.ts              |  93 [32m++++[m
 src/app/Commentservice/comment.interceptor.spec.ts |  17 [32m+[m
 src/app/Commentservice/comment.interceptor.ts      |  69 [32m+++[m
 src/app/Model/Comment.ts                           |   5 [32m+[m
 src/app/Model/Login.ts                             |   4 [32m+[m
 src/app/Model/Post.ts                              |  34 [32m++[m
 src/app/Model/Signup.ts                            |  13 [32m+[m
 .../Moderationservice/moderation.service.spec.ts   |  16 [32m+[m
 src/app/Moderationservice/moderation.service.ts    |  42 [32m++[m
 .../Postservice/post.service.interceptor.spec.ts   |  12 [32m+[m
 src/app/Postservice/post.service.interceptor.ts    |  96 [32m++++[m
 src/app/Signupservices/user.service.spec.ts        |  16 [32m+[m
 src/app/Signupservices/user.service.ts             |  27 [32m++[m
 .../Sugggestionservices/suggestion.service.spec.ts |  16 [32m+[m
 src/app/Sugggestionservices/suggestion.service.ts  |  53 [32m+++[m
 .../admin-dashboard/admin-dashboard.component.css  |  18 [32m+[m
 .../admin-dashboard/admin-dashboard.component.html | 127 [32m++++++[m
 .../admin-dashboard.component.spec.ts              |  23 [32m+[m
 .../admin-dashboard/admin-dashboard.component.ts   | 194 [32m+++++++++[m
 src/app/admin/users/users.component.css            |   2 [32m+[m
 src/app/admin/users/users.component.html           |  38 [32m++[m
 src/app/admin/users/users.component.spec.ts        |  23 [32m+[m
 src/app/admin/users/users.component.ts             |  63 [32m+++[m
 src/app/app.component.html                         | 337 [32m+[m[31m-------------[m
 src/app/app.component.spec.ts                      |  31 [32m+[m[31m-[m
 src/app/app.component.ts                           |   5 [32m+[m[31m-[m
 src/app/app.config.ts                              |  12 [32m+[m[31m-[m
 src/app/app.routes.ts                              |  28 [32m+[m[31m-[m
 src/app/auth/auth.guard.spec.ts                    |  17 [32m+[m
 src/app/auth/auth.guard.ts                         |  35 [32m++[m
 src/app/auth/auth.interceptor.spec.ts              |  17 [32m+[m
 src/app/auth/auth.interceptor.ts                   |  37 [32m++[m
 src/app/footer/footer.component.css                |   0
 src/app/footer/footer.component.html               |   3 [32m+[m
 src/app/footer/footer.component.spec.ts            |  23 [32m+[m
 src/app/footer/footer.component.ts                 |  12 [32m+[m
 src/app/header/header.component.css                |   7 [32m+[m
 src/app/header/header.component.html               |  46 [32m++[m
 src/app/header/header.component.spec.ts            |  23 [32m+[m
 src/app/header/header.component.ts                 |  88 [32m++++[m
 src/app/home/home.component.css                    |   0
 src/app/home/home.component.html                   |   1 [32m+[m
 src/app/home/home.component.spec.ts                |  23 [32m+[m
 src/app/home/home.component.ts                     |  12 [32m+[m
 src/app/login/login.component.css                  |  28 [32m++[m
 src/app/login/login.component.html                 |  23 [32m+[m
 src/app/login/login.component.spec.ts              |  23 [32m+[m
 src/app/login/login.component.ts                   |  55 [32m+++[m
 src/app/moderation/moderation.component.css        |   0
 src/app/moderation/moderation.component.html       |  33 [32m++[m
 src/app/moderation/moderation.component.spec.ts    |  23 [32m+[m
 src/app/moderation/moderation.component.ts         |  47 [32m++[m
 .../pending-posts/pending-posts.component.css      |   0
 .../pending-posts/pending-posts.component.html     |  25 [32m++[m
 .../pending-posts/pending-posts.component.spec.ts  |  23 [32m+[m
 .../pending-posts/pending-posts.component.ts       |  60 [32m+++[m
 .../reported-posts/reported-posts.component.css    |   0
 .../reported-posts/reported-posts.component.html   |  25 [32m++[m
 .../reported-posts.component.spec.ts               |  23 [32m+[m
 .../reported-posts/reported-posts.component.ts     |  56 [32m+++[m
 src/app/post/post-detail/post-detail.component.css | 292 [32m+++++++++++++[m
 .../post/post-detail/post-detail.component.html    | 112 [32m+++++[m
 .../post/post-detail/post-detail.component.spec.ts |  23 [32m+[m
 src/app/post/post-detail/post-detail.component.ts  | 371 [32m++++++++++++++++[m
 src/app/post/post-list/post-list.component.css     |   8 [32m+[m
 src/app/post/post-list/post-list.component.html    |  74 [32m++++[m
 src/app/post/post-list/post-list.component.spec.ts |  23 [32m+[m
 src/app/post/post-list/post-list.component.ts      |  97 [32m+++++[m
 src/app/postpage/postpage.component.css            | 117 [32m+++++[m
 src/app/postpage/postpage.component.html           |  78 [32m++++[m
 src/app/postpage/postpage.component.spec.ts        |  23 [32m+[m
 src/app/postpage/postpage.component.ts             | 126 [32m++++++[m
 src/app/profile/profile.component.css              |   0
 src/app/profile/profile.component.html             |   4 [32m+[m
 src/app/profile/profile.component.spec.ts          |  23 [32m+[m
 src/app/profile/profile.component.ts               |  33 [32m++[m
 src/app/signup/signup.component.css                |  42 [32m++[m
 src/app/signup/signup.component.html               |  56 [32m+++[m
 src/app/signup/signup.component.spec.ts            |  23 [32m+[m
 src/app/signup/signup.component.ts                 |  51 [32m+++[m
 src/app/suggestions/suggestions.component.css      |   3 [32m+[m
 src/app/suggestions/suggestions.component.html     |  53 [32m+++[m
 src/app/suggestions/suggestions.component.spec.ts  |  23 [32m+[m
 src/app/suggestions/suggestions.component.ts       | 115 [32m+++++[m
 src/index.html                                     |   3 [32m+[m
 src/styles.css                                     |   1 [32m+[m
 90 files changed, 3925 insertions(+), 576 deletions(-)
