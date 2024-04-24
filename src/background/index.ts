let minifluxUrl: string
let minifluxApiKey: string
let refreshInterval: number = 10

function loadOptions() {
  console.log('loadOptions')
  chrome.storage.sync.get({ minifluxUrl: '', minifluxApiKey: '', refreshInterval: '10' }, (items) => {
    minifluxUrl = items.minifluxUrl
    minifluxApiKey = items.minifluxApiKey
    refreshInterval = items.refreshInterval
    refresh()
  })
}

chrome.action.onClicked.addListener((tab) => {
  openPage()
})

function openPage() {
  chrome.tabs.create({ url: minifluxUrl + '/unread' });
}

let refreshTimeout: ReturnType<typeof setTimeout>
function refresh() {
  console.log('refresh')
  clearTimeout(refreshTimeout) // make sure to cancel any previous timeout
  refreshTimeout = setTimeout(refresh, refreshInterval * 1000 * 60)

  fetch(minifluxUrl + '/v1/entries?status=unread', {
    headers: {
      'X-Auth-Token': minifluxApiKey
    }
  })
    .then(response => response.json())
    .then(data => {
      updateIcon(data.total)
    })
    .catch(error => {
      console.log(error)
      updateIcon(-1)
    });
}

function updateIcon(unreadCount: number) {
  if (unreadCount > 0) {
    chrome.action.setBadgeText({ text: unreadCount.toString() });
    chrome.action.setBadgeBackgroundColor({ color: "blue" });
    chrome.action.setIcon({
      path: {
        "19": "/img/mf_unread_19.png",
        "38": "/img/mf_unread_38.png"
      }
    });
  } else if (unreadCount == -1) {
    chrome.action.setBadgeText({ text: "E" });
    chrome.action.setBadgeBackgroundColor({ color: "red" });
    chrome.action.setIcon({
      path: {
        "19": "/img/mf_error_19.png",
        "38": "/img/mf_error_38.png"
      }
    });
  } else {
    chrome.action.setBadgeText({ text: "" });
    chrome.action.setIcon({
      path: {
        "19": "/img/mf_dormant_19.png",
        "38": "/img/mf_dormant_38.png"
      }
    });
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  chrome.runtime.openOptionsPage()
  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.action === "updateIcon") {
      updateIcon(msg.value)
    } else if (msg.action === "saveOptions") {
      loadOptions()
    }
  });

  loadOptions()
})
