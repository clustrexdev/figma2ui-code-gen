import re
import json
import requests
from typing import List, Dict
from urllib.parse import urlparse


class ProjectProps(Dict):
    id : str
    name : str

# Personal Access Token (keep this secure)
personal_access_token = ""

class TeamParser:
    def __init__(self, team_url: str):
        self.team_url = team_url

    def parse_team_id(self) -> str:
        path = urlparse(self.team_url).path
        match = re.search(r"/team/(\d+)/", path)
        if not match:
            raise ValueError(f"Team ID not found in URL: {self.team_url}")
        return match.group(1)

class FigmaAPI:
    def __init__(self, token: str):
        self.headers = {'X-FIGMA-TOKEN': token}

    def get_team_projects(self, team_id: str) -> List[dict]:
        url = f"https://api.figma.com/v1/teams/{team_id}/projects"
        res = requests.get(url, headers=self.headers)
        res.raise_for_status()
        return res.json().get('projects', [])

    def get_project_files(self, project_id: str) -> List[dict]:
        url = f"https://api.figma.com/v1/projects/{project_id}/files"
        res = requests.get(url, headers=self.headers)
        res.raise_for_status()
        return res.json().get('files', [])

if __name__ == "__main__":
    figma_url = "https://www.figma.com/files/team/1496553157906487928/project/372365418/Clustrex-Projects?fuid=1496553155874041737"

    team_id = TeamParser(figma_url).parse_team_id()
    print(f"Team ID: {team_id}")

    figma_api = FigmaAPI(token=personal_access_token)

    projects = figma_api.get_team_projects(team_id)
    print(f"Projects: {projects}")

    for project in projects:
        print(f"\nFiles in project '{project['name']}' (ID: {project['id']}):")
        files = figma_api.get_project_files(project['id'])
        print(files)