<?php

namespace FritWork;

define('ROOT_PATH', dirname(__DIR__));

require_once ROOT_PATH . '\FritWork\Library\base_facebook.php';
require_once ROOT_PATH . '\FritWork\Library\facebook.php';

//use Zend\Cache\StorageFactory;

class Module {

    public function getAutoloaderConfig() {
        return array(
            'Zend\Loader\ClassMapAutoloader' => array(
                __DIR__ . '/autoload_classmap.php',
            ),
            'Zend\Loader\StandardAutoloader' => array(
                'namespaces' => array(
                    __NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__,
                ),
            ),
        );
    }

    public function getConfig() {
        return include __DIR__ . '/config/module.config.php';
    }

    public function getServiceConfig() {

        return array(
            'factories' => array(
                'FritWork\Model\FacebookConnect' => function($sm) {

                    $facebook = new \Facebook($sm->get('config')['facebook']);

                    $cache = \Zend\Cache\StorageFactory::factory(array(
                                'adapter' => 'filesystem',
                                'plugins' => array(
                                    'exception_handler' => array('throw_exceptions' => true),
                                    'serializer'
                                ),
                            ));

                    $cache->setOptions(array(
                        'cache_dir' => './data/cache',
                        'ttl' => 3
                    ));

                    return new Model\FacebookConnect($facebook, $cache);
                },
            ),
        );
    }

}

?>
