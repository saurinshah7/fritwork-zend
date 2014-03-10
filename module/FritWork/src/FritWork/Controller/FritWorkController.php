<?php

namespace FritWork\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class FritWorkController extends AbstractActionController {

    protected $facebookConnect;

    public function getFacebookConnect() {
        if (!$this->facebookConnect) {
            $sm = $this->getServiceLocator();
            $this->facebookConnect = $sm->get('FritWork\Model\FacebookConnect');
        }

        return $this->facebookConnect;
    }

    public function indexAction() {
        if ($this->getFacebookConnect()->getUser()) {
            return $this->mainAction();
        } else {
            return $this->enterAction();
        }
    }

    public function enterAction() {
        $serverUrl=$this->getServerUrl();
        $view =  new ViewModel(array(
                    'login' => $this->getFacebookConnect()->getLoginURL($serverUrl),
                ));
        $view->setTemplate('site/enter');
        return $view;
    }

    public function mainAction() {
        $serverUrl=$this->getServerUrl();
        $view = new ViewModel(array(
                    'logout' => $this->getFacebookConnect()->getLogoutURL($serverUrl),
                ));
        $view->setTemplate('site/main');
        return $view;
    }

    public function friendsAction() {
        $response = $this->getResponse();
        return $response->setContent(\Zend\Json\Json::encode($this->getFacebookConnect()->getAllFriends()));
    }

    public function friendshipsAction() {
        $response = $this->getResponse();
        return $response->setContent(\Zend\Json\Json::encode($this->getFacebookConnect()->getAllFriendships()));
    }

    public function logoutAction() {
        setcookie('fbs_' . $this->getFacebookConnect()->getAppId(), '', time() - 100, '/', 'http://fretwork.dev');
        session_destroy();
        $this->getFacebookConnect()->clearCache();
        $view = new ViewModel();
         
        header('Location: '.$this->getServerUrl());
    }
    
    public function getServerUrl(){
      return  $this->getRequest()->getUri()->getScheme() . '://' . $this->getRequest()->getUri()->getHost().'/';
    }

}

?>
