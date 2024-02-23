const overview = document.querySelector (".overview");
const username = "jeanette-f";
const repoList = document.querySelector (".repo-list");
const repoSection = document.querySelector(".repos");
const repoDataList = document.querySelector (".repo-data");
const viewReposButton = document.querySelector (".view-repos");
const filterInput = document.querySelector (".filter-repos");

const gitUserInfo = async function () {
    const userInfo = await fetch (`https://api.github.com/users/${username}`);
    const data = await userInfo.json();
    // console.log(data);
    displayUserInfo(data);
};

gitUserInfo();

const displayUserInfo = function(data) {
    const div = document.createElement ("div");
    div.classList.add ("user-info");
    div.innerHTML = `
    <figure>
        <img alt="user avatar" src=${data.avatar_url} />
    </figure>
    <div>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Bio:</strong> ${data.bio}</p>
      <p><strong>Location:</strong> ${data.location}</p>
      <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
    </div> 
    `;
    overview.append(div);
    gitRepos();
};

const gitRepos = async function () {
    const fetchRepos = await fetch (`https://api.github.com/users/${username}/repos?sort=updated&per_page=15`);
    const repoData = await fetchRepos.json();
    // console.log (repoData);
    displayRepos(repoData);
};

const displayRepos = function (repos) {
    filterInput.classList.remove ("hide");
    for (const repo of repos) {
        const repoItem = document.createElement ("li");
        repoItem.classList.add ("repo");
        repoItem.innerHTML = `<h3>${repo.name}</h3>`;
        repoList.append(repoItem);
    }
};

// click event to display specific repo info upon selection
repoList.addEventListener ("click", function (e) {
    if (e.target.matches("h3")) {
        const repoName = e.target.innerText;
        // console.log(repoName);
        viewRepo(repoName);
    }
});

const viewRepo = async function(repoName) {
    const fetchRepoDetails = await fetch (`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await fetchRepoDetails.json();
    // grab list of programming languages within the repo
    const fetchLanguages = await fetch (repoInfo.languages_url);
    const languageData = await fetchLanguages.json();   
    // create array to list those langauges
    const languages = [];
    for ( const language in languageData) {
        languages.push(language);
    }
    
    displayRepoInfo(repoInfo, languages);
};

const displayRepoInfo = function (repoInfo, languages) {
    repoDataList.innerHTML = "";
    const div = document.createElement ("div");
    div.innerHTML = `
        <h3>Name: ${repoInfo.name}</h3>
        <p>Description: ${repoInfo.description}</p>
        <p>Default Branch: ${repoInfo.default_branch}</p>
        <p>Languages: ${languages.join(", ")}</p>
        <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
    `;
    repoDataList.append(div);
    repoDataList.classList.remove ("hide");
    repoSection.classList.add ("hide");
    viewReposButton.classList.remove ("hide");
};

viewReposButton.addEventListener ("click", function() {
    repoSection.classList.remove ("hide");
    repoDataList.classList.add ("hide");
    viewReposButton.classList.add ("hide");
});

filterInput.addEventListener ("input", function(e){
    const searchText = e.target.value;
    const repos = document.querySelectorAll (".repo");
    const searchLowerText = searchText.toLowerCase();
    
    for (const repo of repos) {
        let lowerRepoName = repo.innerText.toLowerCase();
        if (lowerRepoName.includes(searchLowerText)) {
            repo.classList.remove ("hide");
        } else {
            repo.classList.add ("hide");
        }
    }
});