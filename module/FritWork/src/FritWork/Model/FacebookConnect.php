<?php

namespace FritWork\Model;

class FacebookConnect {

    protected $facebook;
    protected $cache;

    public function __construct($facebook, $cache) {
        $this->facebook = $facebook;
        $this->cache = $cache;
    }

    public function getAppId() {
        return $this->facebook->getAppId();
    }

    public function getUser() {
        return $this->facebook->getUser();
    }

    public function clearCache() {
        $this->cache->removeItem($this->getUser());
    }

    public function getAllFriends() {

        $result = $this->facebook->api(array('method' => 'fql.query', 'query' => 'select uid,name,pic_square from user where uid in (select uid1 from friend where uid2=me()) order by uid asc limit 200'));
        $friends = array();
        $uidToIdMap = array();
        $i = 0;
        foreach ($result as $row) {
            $uidToIdMap[$row['uid']] = $i;
            $friend = new Entity\Friend();
            $friend->setId($i)
                    ->setName($row['name'])
                    ->setPicURL($row['pic_square']);
            $friends[] = $friend;
            $i++;
        }

        $this->cache->setItem(md5($this->facebook->getUser()), json_encode($uidToIdMap));

        return $friends;
    }

    public function getAllFriendships() {
        $result = $this->facebook->api(array('method' => 'fql.query', 'query' => 'select uid1,uid2 from friend where uid1 in (select uid from user where uid in (select uid1 from friend where uid2=me()) order by uid asc limit 200) and uid2 in (select uid from user where uid in (select uid1 from friend where uid2=me()) order by uid asc limit 200)'));
        $friendships = array();

        $uidToIdMap = json_decode($this->cache->getItem(md5($this->getUser())), true);
        $this->cache->removeItem(md5($this->getUser()));
        foreach ($result as $row) {
            $friendship = new Entity\Friendship($uidToIdMap[$row['uid1']], $uidToIdMap[$row['uid2']]);
            if (!in_array($friendship, $friendships)) {
                $friendships[] = $friendship;
            }
        }


        return $friendships;
    }

    public function getLoginURL($url) {

        return $this->facebook->getLoginUrl(array('redirect_uri' => $url));
    }

    public function getLogoutURL($url) {
        return $this->facebook->getLogoutUrl(array('next' => $url . 'fritwork/logout'));
    }

}

?>
