<?php

return array(
    'controllers' => array(
        'invokables' => array(
            'FritWork\Controller\FritWork' => 'FritWork\Controller\FritWorkController',
        ),
    ),
    'router' => array(
        'routes' => array(
            'fritwork' => array(
                'type' => 'segment',
                'options' => array(
                    'route' => '/fritwork[/:action][/:id]',
                    'constraints' => array(
                        'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                        'id' => '[0-9]+',
                    ),
                    'defaults' => array(
                        'controller' => 'FritWork\Controller\FritWork',
                        'action' => 'index',
                    ),
                ),
            ),
        ),
    ),
    'view_manager' => array(
        'template_path_stack' => array(
            'fritwork' => __DIR__ . '/../view',
        ),
        'template_map' => array(
            'site/enter' => __DIR__.'/../view/frit-work/frit-work/enter.phtml',
            'site/main' => __DIR__.'/../view/frit-work/frit-work/main.phtml',
            
        ),
    ),
);
?>
