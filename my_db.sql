drop database if exists my_db;
create database my_db;
use my_db;

drop table if exists users; 
create table users(
	email varchar(255) not null unique,
    password varchar(255) not null,
    id int primary key not null auto_increment,
    bio mediumtext,
    pseudo varchar(255),
    profil_pic varchar(255),
    created_at timestamp,
    token varchar(255) unique,
    permissions int
);


drop table if exists posts;
create table posts(
	id int primary key not null auto_increment,
    message text,
    video varchar(255),
    image varchar(255),
    author int not null, 
    created_at timestamp,
    
    foreign key references_posts_on_users_id(author) references users(id) on delete cascade
    
);

drop table if exists comments;
create table comments(
	id int primary key auto_increment,
    message text not null,
    author int not null,
    post int not null,
    create_at timestamp not null default current_timestamp(),
    update_at timestamp not null default current_timestamp(),
    
    foreign key references_comments_on_posts_id(post) references posts(id) on delete cascade,
    foreign key references_comments_on_users_id(author) references users(id) on delete cascade
);

drop table if exists likes;
create table likes(
	id int primary key not null auto_increment,
    author int not null,
    post int not null,
    
    foreign key references_likes_on_posts_id(post) references posts(id) on delete cascade,
    foreign key references_likes_on_users_id(author) references users(id) on delete cascade,
    
    unique key unique_author_post(author, post)
);

PREPARE get_user_info FROM "SELECT id,email,bio,pseudo,profil_pic,created_at,permissions 
    FROM users WHERE id=?";
