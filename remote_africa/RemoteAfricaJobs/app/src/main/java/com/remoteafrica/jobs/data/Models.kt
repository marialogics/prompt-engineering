package com.remoteafrica.jobs.data

data class JobListing(
    val id: String,
    val title: String,
    val company: String,
    val description: String,
    val location: String,
    val url: String,
    val source: String,
    val postedDate: String
)

data class Site(
    val name: String,
    val url: String,
    val category: String
)
