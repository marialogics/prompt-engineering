package com.remoteafrica.jobs.data

import com.google.gson.Gson
import okhttp3.OkHttpClient
import java.util.UUID

object SitesRepository {
    private val client = OkHttpClient()
    private val gson = Gson()

    suspend fun fetchAllJobListings(): List<JobListing> {
        val sites = fetchSites()
        val jobListings = mutableListOf<JobListing>()

        for (site in sites) {
            try {
                val jobs = fetchJobsFromSite(site)
                jobListings.addAll(jobs)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }

        return jobListings
    }

    private fun fetchSites(): List<Site> {
        return listOf(
            Site("LinkedIn", "https://www.linkedin.com/jobs/search/?keywords=remote", "Job Board"),
            Site("We Work Remotely", "https://weworkremotely.com/", "Remote Jobs"),
            Site("FlexJobs", "https://www.flexjobs.com/", "Remote Jobs"),
            Site("Remote.co", "https://remote.co/", "Remote Jobs")
        )
    }

    private fun fetchJobsFromSite(site: Site): List<JobListing> {
        return listOf(
            JobListing(
                id = UUID.randomUUID().toString(),
                title = "Sample Job from ${site.name}",
                company = "Sample Company",
                description = "This is a sample job listing from ${site.name}",
                location = "Remote",
                url = site.url,
                source = site.name,
                postedDate = "2024-01-01"
            )
        )
    }
}
