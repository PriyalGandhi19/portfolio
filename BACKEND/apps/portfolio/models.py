from django.db import models


class Skill(models.Model):
    category = models.CharField(max_length=50)
    name = models.CharField(max_length=150)
    # No numeric proficiency score on purpose — a self-assigned "90%" is not
    # a verifiable fact. What's shown instead is the evidence for why this
    # skill is listed at all.
    evidence = models.TextField()

    class Meta:
        ordering = ['category', 'name']

    def __str__(self):
        return f"{self.category} - {self.name}"


class Project(models.Model):
    title = models.CharField(max_length=100)
    tagline = models.CharField(max_length=150, blank=True)
    overview = models.TextField()
    technologies = models.JSONField(default=list)
    key_features = models.JSONField(default=list)
    github_url = models.URLField(blank=True)
    demo_url = models.URLField(blank=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return self.title


class Experience(models.Model):
    role = models.CharField(max_length=100)
    company = models.CharField(max_length=100)
    location = models.CharField(max_length=100, blank=True)
    period = models.CharField(max_length=50)
    description = models.JSONField(default=list)
    technologies = models.JSONField(default=list)
    key_result = models.TextField(blank=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.role} at {self.company}"
